from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

robux_inline_keyboard = InlineKeyboardMarkup(
    inline_keyboard=[
        [InlineKeyboardButton(text="Получить робуксы 🤑", callback_data="get_robux")],
    ]
)

check_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
        # [
        #     InlineKeyboardButton(text="Вступить ❶", callback_data="channel-1"),
        #     InlineKeyboardButton(text="Вступить ❷", callback_data="channel-2"),
        # ],
        [
            InlineKeyboardButton(text="Вступить ➤", url="https://t.me/roblox_quenn_rb"),
        ],
        [
            InlineKeyboardButton(text="Проверить ✅", callback_data="check"),
        ]
    ]
)

reborn = InlineKeyboardMarkup(
    inline_keyboard = [
        [
            InlineKeyboardButton(text='Повторить', callback_data="get_robux")
        ]
    ] 
)

true = InlineKeyboardMarkup(
    inline_keyboard = [
        [
            InlineKeyboardButton(text='Да, Верно ✔️', callback_data="NAME_TRUE")
        ],
        [
            InlineKeyboardButton(text='Нет, ввести другой ✖', callback_data="NAME_FALSE")
        ]
    ] 
)

MyProfile = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(text='Ваш ник', callback_data='your_nick_callback'), 
            InlineKeyboardButton(text='robloxState', callback_data='roblox_state_info')
        ],
        [
            InlineKeyboardButton(text='Сумма', callback_data='sum_callback'), 
            InlineKeyboardButton(text='25000 RB', callback_data='rbx_amount_info')
        ],
        [
            InlineKeyboardButton(text='Статус', callback_data='status_callback'), 
            InlineKeyboardButton(text='В обработке', callback_data='status_info')
        ],
        [
            InlineKeyboardButton(text='❗ Правила ❗', callback_data='RULES')
        ]
    ]
)