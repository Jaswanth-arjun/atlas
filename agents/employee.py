import random
from dataclasses import dataclass, field
from typing import Dict, List


@dataclass
class EmployeeAgent:
    role: str
    personality: Dict
    happiness: float = 70.0
    performance: float = 65.0
    incentives: float = 1.0
    memory: List[Dict] = field(default_factory=list)
    goals: List[str] = field(default_factory=list)

    def react(self, action: str, state: Dict) -> str:
        msg = f"{self.role} acknowledges decision: {action}"
        if self.role == "sales_lead" and action in {"run_ads", "negotiate_client"}:
            self.performance += 2
            msg = "If marketing budget increases, I can close more leads."
        elif self.role == "engineering_manager" and action in {
            "assign_engineering_task",
            "launch_product",
        }:
            self.performance += 1.5
            self.happiness -= 0.5
            msg = "We need 3 more developers to hit roadmap."
        elif self.role == "finance_officer" and action in {
            "increase_salaries",
            "give_bonuses",
        }:
            self.happiness -= 1
            msg = "Burn rate is dangerous. Reduce spending."
        elif self.role == "hr_recruiter" and state["employee_morale"] < 50:
            self.happiness -= 1
            msg = "Morale is dropping."
        elif self.role == "customer_success" and state["customer_satisfaction"] < 60:
            self.performance -= 1
            msg = "Support load is rising; churn risk is increasing."

        self.happiness = max(0, min(100, self.happiness + random.uniform(-1, 1)))
        self.performance = max(0, min(100, self.performance + random.uniform(-1, 1)))
        self.memory.append({"action": action, "message": msg})
        return msg
