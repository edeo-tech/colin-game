import { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Gamepad2, 
  Sparkles, 
  Users, 
  Rocket, 
  BookOpen,
  ChevronDown,
  Loader2,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRegisterUser } from './_queries/users/auth/users';
import './App.css';

function App() {
  const [urlParams, setUrlParams] = useState<{
    username?: string;
    email?: string;
    school?: string;
  }>({});
  
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const hasAutoRegistered = useRef(false);
  
  const registerMutation = useRegisterUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username') || undefined;
    const email = params.get('email') || undefined;
    const school = params.get('school') || undefined;
    
    setUrlParams({ username, email, school });

    // Auto-register if URL params exist
    if (username && email && !hasAutoRegistered.current) {
      hasAutoRegistered.current = true;
      const userData = {
        username,
        email,
        password: email.split('@')[0],
        school_name: school,
        last_lat: 0,
        last_long: 0,
        device_os: 'web'
      };

      registerMutation.mutate(userData, {
        onSuccess: () => {
          setHasJoined(true);
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.detail || 'Registration failed silently';
          console.error(errorMessage);
          // Don't show error toast for auto-registration
        }
      });
    }
  }, []);

  const handleJoinWaitlist = async () => {
    setIsJoining(true);
    
    // If URL params exist, just show the loading/success animation
    if (urlParams.email) {
      setTimeout(() => {
        setIsJoining(false);
        setHasJoined(true);
        toast.success('Successfully joined the waitlist!');
      }, 1500);
      return;
    }

    // Otherwise, actually register
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.email.split('@')[0],
      last_lat: 0,
      last_long: 0,
      device_os: 'web'
    };

    try {
      await registerMutation.mutateAsync(userData);
      setHasJoined(true);
      toast.success('Successfully joined the waitlist!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to join waitlist. Please try again.';
      toast.error(errorMessage);
    } finally {
      setTimeout(() => setIsJoining(false), 1000);
    }
  };

  const isFormValid = urlParams.email || (formData.username && formData.email);

  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Transforming Education Through Gaming</span>
            </div>
            
            <h1 className="hero-title">
              Create Custom Educational Games
              <span className="gradient-text"> In Minutes</span>
            </h1>
            
            <p className="hero-description">
              Turn any subject into an engaging game. Perfect for teachers, students, and lifelong learners.
              Create, remix, and share educational games that make learning unforgettable.
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Games Created</div>
              </div>
              <div className="stat">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Active Learners</div>
              </div>
              <div className="stat">
                <div className="stat-number">95%</div>
                <div className="stat-label">Engagement Rate</div>
              </div>
            </div>
            
            <a href="#waitlist" className="hero-cta">
              Join the Waitlist
              <ChevronDown size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to Make Learning Fun</h2>
            <p>Powerful features designed for educators and learners</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Brain />
              </div>
              <h3>AI-Powered Creation</h3>
              <p>Generate educational games on any topic instantly. Our AI understands your curriculum and creates engaging content.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Gamepad2 />
              </div>
              <h3>Multiple Game Formats</h3>
              <p>Choose from quizzes, puzzles, adventures, and more. Each format is optimized for different learning styles.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Users />
              </div>
              <h3>Remix & Share</h3>
              <p>Build on existing games or create from scratch. Share with your class or the entire community.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <BookOpen />
              </div>
              <h3>Any Subject, Any Level</h3>
              <p>From kindergarten math to advanced physics. Adapt difficulty and content to your exact needs.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Rocket />
              </div>
              <h3>Real-Time Analytics</h3>
              <p>Track progress, identify knowledge gaps, and celebrate achievements with detailed insights.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles />
              </div>
              <h3>Engagement Guaranteed</h3>
              <p>Gamification elements like points, badges, and leaderboards keep learners motivated and coming back.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="waitlist">
        <div className="container">
          <div className="waitlist-content">
            <div className="waitlist-header">
              <h2>Join the Educational Revolution</h2>
              <p>
                {urlParams.email 
                  ? "You're just one click away from transforming how you learn!"
                  : "Be among the first to create amazing educational games"
                }
              </p>
              <div className="demand-badge">
                <span className="pulse-dot"></span>
                <span>High demand - Limited spots available</span>
              </div>
            </div>
            
            {urlParams.email ? (
              <div className="waitlist-prefilled">
                {/* <div className="user-info">
                  <p>Welcome, <strong>{urlParams.username}</strong>!</p>
                  <p className="user-email">{urlParams.email}</p>
                  {urlParams.school && <p className="user-school">{urlParams.school}</p>}
                </div> */}
                
                <button 
                  className={`join-button ${hasJoined ? 'success' : ''}`}
                  onClick={handleJoinWaitlist}
                  disabled={isJoining || hasJoined}
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="spin" size={20} />
                      Joining...
                    </>
                  ) : hasJoined ? (
                    <>
                      <Check size={20} />
                      You're on the list!
                    </>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
              </div>
            ) : (
              <form className="waitlist-form" onSubmit={(e) => {
                e.preventDefault();
                handleJoinWaitlist();
              }}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Choose your username"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  className={`join-button ${hasJoined ? 'success' : ''}`}
                  disabled={!isFormValid || isJoining || hasJoined}
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="spin" size={20} />
                      Joining...
                    </>
                  ) : hasJoined ? (
                    <>
                      <Check size={20} />
                      You're on the list!
                    </>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
              </form>
            )}
            
            <p className="waitlist-note">
              We'll notify you as soon as we're ready to launch. No spam, promise!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;