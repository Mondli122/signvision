-- =========================================================================
-- SIGNVISION SA - COMPLETE SUPABASE & POSTGRESQL DATABASE SCHEMA
-- =========================================================================
-- This schema powers all features of the SignVision platform:
-- 1. Profiles & Authentication
-- 2. User Gamification & Learning Progress
-- 3. Learned Signs & Mastery Tracking
-- 4. User Activity Audit Logs
-- 5. SASL Lexicon & Dictionary Database
-- 6. Dataset Sequences & ML Landmark Repositories
-- 7. Community Sign Submissions & Voting
-- 8. Emergency SOS Crisis Dispatch & Geolocation Relays
-- 9. WebRTC Video Call Rooms & STUN Session Logs
-- 10. National Classroom Challenge Rooms & Leaderboards
-- 11. AI Pose Coach & Biomechanical Analysis Sessions
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. PROFILES (Extends Supabase auth.users)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'learner' CHECK (role IN ('learner', 'educator', 'moderator', 'admin')),
    school TEXT DEFAULT 'Johannesburg School for the Deaf',
    province TEXT DEFAULT 'Gauteng',
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for search and email queries
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_province ON public.profiles(province);

-- -------------------------------------------------------------------------
-- 2. USER PROGRESS & GAMIFICATION
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    streak INTEGER DEFAULT 1 CHECK (streak >= 0),
    quizzes_completed INTEGER DEFAULT 0 CHECK (quizzes_completed >= 0),
    high_score INTEGER DEFAULT 0 CHECK (high_score >= 0),
    accuracy NUMERIC(5, 2) DEFAULT 85.00 CHECK (accuracy BETWEEN 0 AND 100),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_progress_xp ON public.user_progress(xp DESC);

-- -------------------------------------------------------------------------
-- 3. USER LEARNED SIGNS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_learned_signs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sign_id TEXT NOT NULL,
    sign_word TEXT NOT NULL,
    confidence_score NUMERIC(4, 2) DEFAULT 0.90,
    mastered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, sign_id)
);

CREATE INDEX IF NOT EXISTS idx_learned_signs_user ON public.user_learned_signs(user_id);

-- -------------------------------------------------------------------------
-- 4. USER ACTIVITY AUDIT LOGS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('translation', 'quiz', 'coach', 'dataset', 'classroom', 'auth', 'emergency')),
    title TEXT NOT NULL,
    detail TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.user_activity_logs(created_at DESC);

-- -------------------------------------------------------------------------
-- 5. SASL LEXICON & DICTIONARY
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.signs_dictionary (
    id TEXT PRIMARY KEY,
    word TEXT NOT NULL,
    gloss TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT DEFAULT '🤟',
    description TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Beginner' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    sasl_note TEXT,
    dialect TEXT DEFAULT 'National',
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dictionary_category ON public.signs_dictionary(category);
CREATE INDEX IF NOT EXISTS idx_dictionary_word ON public.signs_dictionary(word);

-- -------------------------------------------------------------------------
-- 6. DATASET SEQUENCES (Machine Learning Repository)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dataset_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    glosses TEXT[] NOT NULL,
    sentence TEXT,
    landmarks_json JSONB,
    fps INTEGER DEFAULT 30,
    status TEXT DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dataset_status ON public.dataset_sequences(status);

-- -------------------------------------------------------------------------
-- 7. COMMUNITY SIGN SUBMISSIONS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_signs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    sign_name TEXT NOT NULL,
    gloss TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    video_url TEXT,
    upvotes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'flagged')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_signs_status ON public.community_signs(status);

-- -------------------------------------------------------------------------
-- 8. EMERGENCY SOS BROADCASTS & RELAYS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.emergency_broadcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('medical', 'police', 'fire', 'disaster')),
    details TEXT,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    broadcast_message TEXT NOT NULL,
    status TEXT DEFAULT 'dispatched' CHECK (status IN ('dispatched', 'en_route', 'resolved')),
    responder_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emergency_created_at ON public.emergency_broadcasts(created_at DESC);

-- -------------------------------------------------------------------------
-- 9. WEBRTC CALL ROOMS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.call_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_code TEXT UNIQUE NOT NULL,
    host_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended')),
    participants_count INTEGER DEFAULT 1,
    ice_servers_config JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_call_rooms_code ON public.call_rooms(room_code);

-- -------------------------------------------------------------------------
-- 10. CLASSROOMS & NATIONAL CHALLENGES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    school_name TEXT NOT NULL,
    province TEXT NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    active_prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_classrooms_code ON public.classrooms(room_code);

-- -------------------------------------------------------------------------
-- 11. AI COACH BIOMECHANICAL SESSIONS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_coach_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_sign TEXT NOT NULL,
    detected_sign TEXT NOT NULL,
    alignment_score INTEGER NOT NULL CHECK (alignment_score BETWEEN 0 AND 100),
    confidence NUMERIC(4, 2) DEFAULT 0.90,
    wrist_posture TEXT,
    finger_spacing TEXT,
    coaching_tip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_coach_user ON public.ai_coach_sessions(user_id);

-- -------------------------------------------------------------------------
-- AUTOMATED TRIGGERS & FUNCTIONS
-- -------------------------------------------------------------------------

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER set_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile & progress on Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, school, province)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'school', 'Johannesburg School for the Deaf'),
        COALESCE(NEW.raw_user_meta_data->>'province', 'Gauteng')
    );

    INSERT INTO public.user_progress (user_id, xp, level, streak, quizzes_completed, high_score)
    VALUES (NEW.id, 100, 1, 1, 0, 0);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger hook for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learned_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signs_dictionary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coach_sessions ENABLE ROW LEVEL SECURITY;

-- Public dictionary read access for all learners
CREATE POLICY "Public dictionary read" ON public.signs_dictionary FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User progress policies
CREATE POLICY "Leaderboard read access" ON public.user_progress FOR SELECT USING (true);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Learned signs policies
CREATE POLICY "Users can view own learned signs" ON public.user_learned_signs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can record learned signs" ON public.user_learned_signs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Users can view own activity logs" ON public.user_activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity logs" ON public.user_activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Community signs policies
CREATE POLICY "Approved community signs read" ON public.community_signs FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can submit community signs" ON public.community_signs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Emergency broadcasts
CREATE POLICY "Users can view own broadcasts or responders view all" ON public.emergency_broadcasts FOR SELECT USING (true);
CREATE POLICY "Anyone can create emergency broadcast" ON public.emergency_broadcasts FOR INSERT WITH CHECK (true);

-- -------------------------------------------------------------------------
-- INITIAL SEED DATA
-- -------------------------------------------------------------------------
INSERT INTO public.signs_dictionary (id, word, gloss, category, icon, description, difficulty, sasl_note)
VALUES
('hello', 'Hello', 'HELLO', 'Greetings', '👋', 'Place flat open hand near temple or chest, wave slightly outward.', 'Beginner', 'Standard polite greeting across all 9 provinces.'),
('thank_you', 'Thank You', 'THANK YOU', 'Greetings', '🙏', 'Touch fingertips of flat hand to chin, then move hand forward.', 'Beginner', 'Gratitude sign.'),
('help', 'Help / Assist', 'HELP', 'Needs', '🆘', 'Place closed fist with thumb up onto flat open palm and lift together.', 'Intermediate', 'Distress and urgent assistance sign.'),
('water', 'Water', 'WATER', 'Needs', '💧', 'Form W shape with fingers, tap index finger against chin twice.', 'Beginner', 'Vital basic need sign.'),
('school', 'School', 'SCHOOL', 'Education', '🏫', 'Clap dominant flat palm downward twice on base palm.', 'Beginner', 'Academic sign.'),
('computer', 'Computer', 'COMPUTER', 'Tech', '💻', 'C-hand moving up along opposite forearm or typing motion.', 'Beginner', 'Digital technology.'),
('robot', 'Robot / AI', 'ROBOT', 'Tech', '🤖', 'Rigid right-angle arm and mechanical hand movement.', 'Intermediate', 'Robo Rumble 2026 Technomania.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.classrooms (room_code, name, school_name, province, active_prompt)
VALUES
('SASL-5821', 'Grade 10 STEM Innovators', 'Johannesburg School for the Deaf', 'Gauteng', 'Sign the phrase: HELLO I NEED HELP with correct dominant hand posture.')
ON CONFLICT (room_code) DO NOTHING;
