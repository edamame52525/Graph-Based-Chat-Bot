-- supabase/migrations/TIMESTAMP_create_tables.sql
CREATE TABLE nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  content TEXT,
  response TEXT,
  from_node UUID,
  color TEXT DEFAULT '#6495ED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE node_embeddings (
  node_id UUID PRIMARY KEY REFERENCES nodes(id) ON DELETE CASCADE,
  embedding vector(1536),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);