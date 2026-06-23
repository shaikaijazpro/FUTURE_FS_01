# Flask backend for Craftivo

Quick setup:

1. Create a Python environment and install deps:

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

2. Run the app:

```bash
python app.py
```

The contact endpoint is available at `POST /api/contact` and returns plain text `OK` on success (this matches the frontend's expectation).
