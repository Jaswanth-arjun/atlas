import random
from typing import Optional

EVENTS = [
    "key_employee_resigns",
    "server_outage",
    "investor_metrics_request",
    "competitor_feature_launch",
    "viral_growth",
    "lawsuit_risk",
    "sales_deal_delayed",
    "hiring_freeze",
    "market_crash",
    "customer_complaints_spike",
]


def maybe_event(prob: float = 0.25) -> Optional[str]:
    return random.choice(EVENTS) if random.random() < prob else None
