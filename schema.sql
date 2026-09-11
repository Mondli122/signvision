-- =========================================================================
-- SIGNVISION SA - STANDARD RELATIONAL DATABASE SCHEMA (SQLITE / POSTGRES)
-- =========================================================================

CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'learner',
    school TEXT DEFAULT 'Johannesburg School for the Deaf',
    province TEXT DEFAULT 'Gauteng',
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_progress (
    user_id TEXT PRIMARY KEY,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 1,
    quizzes_completed INTEGER DEFAULT 0,
    high_score INTEGER DEFAULT 0,
    accuracy REAL DEFAULT 85.0,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_learned_signs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    sign_id TEXT NOT NULL,
    sign_word TEXT NOT NULL,
    confidence_score REAL DEFAULT 0.90,
    mastered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, sign_id),
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_activity_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    activity_type TEXT NOT NULL,
    title TEXT NOT NULL,
    detail TEXT,
    metadata TEXT DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS signs_dictionary (
    id TEXT PRIMARY KEY,
    word TEXT NOT NULL,
    gloss TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT DEFAULT '🤟',
    description TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Beginner',
    sasl_note TEXT,
    dialect TEXT DEFAULT 'National',
    video_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dataset_sequences (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    glosses TEXT NOT NULL,
    sentence TEXT,
    landmarks_json TEXT,
    fps INTEGER DEFAULT 30,
    status TEXT DEFAULT 'verified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS community_signs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    author_name TEXT NOT NULL,
    sign_name TEXT NOT NULL,
    gloss TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    video_url TEXT,
    upvotes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS emergency_broadcasts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    category TEXT NOT NULL,
    details TEXT,
    latitude REAL,
    longitude REAL,
    broadcast_message TEXT NOT NULL,
    status TEXT DEFAULT 'dispatched',
    responder_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS call_rooms (
    id TEXT PRIMARY KEY,
    room_code TEXT UNIQUE NOT NULL,
    host_user_id TEXT,
    status TEXT DEFAULT 'active',
    participants_count INTEGER DEFAULT 1,
    ice_servers_config TEXT DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    FOREIGN KEY (host_user_id) REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS classrooms (
    id TEXT PRIMARY KEY,
    room_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    school_name TEXT NOT NULL,
    province TEXT NOT NULL,
    teacher_id TEXT,
    active_prompt TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ai_coach_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    target_sign TEXT NOT NULL,
    detected_sign TEXT NOT NULL,
    alignment_score INTEGER NOT NULL,
    confidence REAL DEFAULT 0.90,
    wrist_posture TEXT,
    finger_spacing TEXT,
    coaching_tip TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);
