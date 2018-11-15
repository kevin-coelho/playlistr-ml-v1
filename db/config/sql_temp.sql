
		DROP ROLE IF EXISTS playlistr_ml_v1;
		CREATE ROLE playlistr_ml_v1;
		ALTER ROLE playlistr_ml_v1 WITH LOGIN PASSWORD 'plt_210' CREATEDB;
	