if (-not (Test-Path ".\.venv\Scripts\python.exe")) {
  python -m venv .venv
}

. .\.venv\Scripts\Activate.ps1

if (-not (Test-Path ".\.venv\.deps_installed")) {
  pip install -r requirements.txt
  New-Item -Path ".\.venv\.deps_installed" -ItemType File -Force | Out-Null
}

uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
