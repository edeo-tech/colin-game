from fastapi import Request, HTTPException
from fastapi.encoders import jsonable_encoder
from datetime import datetime, timezone


from models.users.users import User
from models.users.authenticated_user import AuthenticatedUser
from models.schools.school import School
from crud._generic import _db_actions

from authentication import Authorization

from utils.strings.username_sanitation import remove_invalid_username_characters
# from utils.qr_codes.profiles.generate import generateQRCode

auth = Authorization()


async def generate_username(req: Request, school_id: str = None) -> str:
    try:
        if school_id:
            # Get school to extract school name
            school = await _db_actions.getDocument(
                req=req,
                collection_name='schools',
                BaseModel=School,
                id=school_id
            )
            
            if school:
                # Count users from this school
                school_user_count = await _db_actions.countDocuments(
                    req=req,
                    collection_name='users',
                    BaseModel=User,
                    school_id=school_id
                )
                
                # Clean school name: remove spaces and punctuation
                clean_school_name = ''.join(c for c in school.school_name if c.isalnum()).lower()
                username = f"student_{school_user_count + 1}_{clean_school_name}"
            else:
                # Fallback if school not found
                total_user_count = await _db_actions.countAllDocuments(
                    req=req,
                    collection_name='users',
                    BaseModel=User
                )
                username = f"student_{total_user_count + 1}"
        else:
            # No school selected - use total user count
            total_user_count = await _db_actions.countAllDocuments(
                req=req,
                collection_name='users',
                BaseModel=User
            )
            username = f"student_{total_user_count + 1}"
        
        return username
    except Exception as e:
        # Fallback to simple numbering if anything fails
        print(f"Error generating username: {e}")
        total_user_count = await _db_actions.countAllDocuments(
            req=req,
            collection_name='users',
            BaseModel=User
        )
        return f"student_{total_user_count + 1}"


async def create_user(req:Request, user:User):
    ## Generate username automatically
    user.username = await generate_username(req, user.school_id)
    
    ## check that username is not already taken - keep adding underscores until it is not taken
    while await check_if_username_is_taken(req, user.username):
        user.username += '_'

    ## strip username of any invalid characters
    user.username = remove_invalid_username_characters(user.username)

    ## generate profile qrcode
    # user.profile_qrcode = await generateQRCode(user.username) // not yet implemented (no web version for linking - only mobile) # needs to be after creation anyway

    ## create user
    user = await _db_actions.createDocument(
        req=req,
        collection_name='users',
        BaseModel=User,
        new_document=user
    )

    return user


async def update_user_last_active_at(req:Request, user_id:str):
    await _db_actions.updateDocument(
        req=req,
        collection_name='users',
        BaseModel=User,
        document_id=user_id,
        last_login=datetime.now(timezone.utc)
    )

async def handle_login(req:Request, user:User):
    await update_user_last_active_at(req, user.id)

    access_token = auth.encode_short_lived_token(user.id)
    refresh_token = await auth.encode_refresh_token(req, user.id)
    user_important_info = jsonable_encoder(AuthenticatedUser(
        **user.model_dump(
            by_alias=False,
            exclude_none=True)
        ),
        exclude_none=True,
        by_alias=False
    )

    return {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user_important_info
    }


async def check_if_username_is_taken(req:Request, username:str):
    user = await _db_actions.getDocument(
        req=req,
        collection_name='users',
        BaseModel=User,
        username=username
    )
    return user is not None


async def get_user_by_id(req:Request, user_id:str):
    user = await _db_actions.getDocument(
        req=req,
        collection_name='users',
        BaseModel=User,
        id=user_id
    )
    return user
