ALTER TABLE policy
  ADD COLUMN close_by_quorum     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN close_by_consensus  BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN consensus_threshold INTEGER NOT NULL DEFAULT 80;
