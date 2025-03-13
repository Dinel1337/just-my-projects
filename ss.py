from typing import List, Dict, Optional
# def make_sandwich(bread_type, *ingredients, **extras):
#     print(f"Making a {bread_type} sandwich with the following ingredients:")
#     for ingredient in ingredients:
#         print(f"- {ingredient}")
#     print("Extras:")
#     for key, value in extras.items():
#         print(f"- {key}: {value}")

# make_sandwich("whole wheat", "ham", "cheese", "lettuce", sauce="mayo", temperature="hot")



# def process_data(data: List[int]) -> Dict[str, int]:
#     return {"length": len(data), "sum": sum(data)}

def greet(name: Optional[int] = "es") -> str:
    if name:
        return f"Hello, {name}!"
    return "Hello, anonymous!"

print(greet("sese"))