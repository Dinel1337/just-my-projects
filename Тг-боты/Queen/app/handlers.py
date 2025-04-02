import asyncio
from aiogram.types import (
Message,
FSInputFile, 
InputMediaPhoto,
CallbackQuery,
ChatMember
)
from aiogram.filters import CommandStart, Command
from aiogram import Router, F, Bot
from .keyboard_bot import robux_inline_keyboard, check_keyboard, reborn, true, MyProfile
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
router = Router()
CHANNEL_ID = -1002043185815

class Form(StatesGroup):
    """Генератор состояний
        Нужен для того что бы обрабатывать сообщения непосредственно
        после определенного состояния
    """
    waiting_for_nickname = State()  # Состояние ожидания ника


async def is_subscribed(bot: Bot, user_id: int, channel_id: int) -> bool:
    try:
        member = await bot.get_chat_member(chat_id=channel_id, user_id=user_id)
        return member.status in ['member', 'administrator', 'creator']
    except Exception:
        return False


@router.message(CommandStart())
async def start_message(message: Message) -> Message:
    
    send = await message.answer('Начисляем робуксы на баланс...\nㅤ\n🟩⬜️⬜️') # Отвечает на сооб

    await asyncio.sleep(1)
    await message.bot.edit_message_text('Начисляем робуксы на баланс...\nㅤ\n🟩🟩⬜️', chat_id=message.chat.id, message_id=send.message_id)

    await asyncio.sleep(1)
    await message.bot.edit_message_text('Начисляем робуксы на баланс...\nㅤ\n🟩🟩🟩', chat_id=message.chat.id, message_id=send.message_id)
    
    photo = FSInputFile("image/roblox.jpg")
    
    await asyncio.sleep(0.5)
    await message.bot.edit_message_media(
        chat_id=message.chat.id,
        message_id=send.message_id,
        media=InputMediaPhoto(
            media=photo,
            caption='✅Ваш баланс: 25.000 робуксов\nㅤ\nХотите отправить их в Roblox?'
        ),
    )
    await message.bot.edit_message_reply_markup(
        chat_id=message.chat.id,
        message_id=send.message_id,
        reply_markup=robux_inline_keyboard
    )
    
@router.callback_query(F.data == "get_robux")
async def process_buttons(callback: CallbackQuery):
    await callback.message.delete()
    
    photo = FSInputFile("image/roblox_check.jpg")
    await callback.message.answer_photo(
        photo=photo,
        caption='✅Ваш баланс: 25.000 робуксов\nㅤ\nХотите отправить их в Roblox?',
        reply_markup=check_keyboard
    )
    await callback.answer()
    
@router.callback_query(lambda c: c.data in ['check', 'NAME_FALSE'])
async def channel(callback: CallbackQuery, bot: Bot, state: FSMContext):
    if await is_subscribed(bot, callback.from_user.id, CHANNEL_ID):
        await callback.message.delete()
        
        photo = FSInputFile("image/accept.jpg")
        await callback.message.answer_photo(
            photo=photo,
            caption='✉️Отправьте ваш ник в Roblox, чтобы я смогла начислить вам робуксы'
        )
        
        await state.set_state(Form.waiting_for_nickname)
        
    else:
        await callback.message.delete()
        await callback.message.answer('Робаксы не отправлены ❌\nㅤ\nВы не подписаны на канал, повторите попытку', reply_markup=reborn)
    await callback.answer()
    
@router.message(Form.waiting_for_nickname)
async def nickname(message: Message, state: FSMContext):
    data = await state.get_data()
    await message.answer('Подтвердите ник👌\nПроверьте, правильно-ли вы его написали.', reply_markup=true)
    await state.clear()

@router.callback_query(F.data == 'NAME_TRUE')
async def profile(callback: CallbackQuery):
    await callback.message.delete()
    mes = ['⬜️', '⬜️', '⬜️', '⬜️', '⬜️']
    n = '✅️'
    send = await callback.message.answer(f'Создаём заявку..\nㅤ\n{"".join(mes)}') # Отвечает на сооб
    for i in range(0, 5):
        mes[i] = n
        await asyncio.sleep(0.5)
        await callback.message.bot.edit_message_text(f'Начисляем робуксы на баланс...\nㅤ\n{"".join(mes)}', chat_id=callback.message.chat.id, message_id=send.message_id)

    photo = FSInputFile("image/profiel.jpg")
    await callback.message.answer_photo(
        photo=photo,
        caption='❤️Ваша заявка создана, мы напишем вам когда робуксы будут отправлены\nㅤ\n Ознакомьтесь с вашим меню, вся информация в этих кнопках👇',
        reply_markup=MyProfile  
    )
    await callback.answer()
    
@router.callback_query(F.data == "RULES")
async def rules(callback: CallbackQuery):
    await callback.answer("1.Не отписываться\nЧто бы ускорить вывод нажми на кнопку Ускорить вывод", show_alert=True)
    await callback.answer()