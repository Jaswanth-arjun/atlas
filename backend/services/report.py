from datetime import datetime

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def generate_investor_report(path: str, metrics: dict) -> None:
    c = canvas.Canvas(path, pagesize=letter)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, 750, "ATLAS Investor Report")
    c.setFont("Helvetica", 11)
    c.drawString(72, 730, f"Generated: {datetime.utcnow().isoformat()}Z")

    y = 700
    for key, value in metrics.items():
        c.drawString(72, y, f"{key}: {value}")
        y -= 20
    c.save()
