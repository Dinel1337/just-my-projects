@router.message(F.content_type == "web_app_data")
async def handle_webapp_data(message: Message):
    try:
        print("Получены WebApp данные:", message.web_app_data)  # Логируем для отладки
        
        data = json.loads(message.web_app_data.data)
        print("Распарсенные данные:", data)  # Логируем структуру данных
        
        if data.get("action") == "phone_shared":
            phone = data["phone_number"]
            await message.answer(f"📱 Номер получен через WebApp: {phone}")
            # Здесь можно сохранить номер в базу данных
            
        elif data.get("status") == "success":
            await message.answer("✅ Успешная авторизация!")
            
    except json.JSONDecodeError:
        await message.answer("❌ Ошибка: Неверный формат данных")
        print("Ошибка декодирования JSON")
    except KeyError as e:
        await message.answer(f"❌ Ошибка: Отсутствует ключ {e}")
        print("Отсутствует ключ в данных:", e)
    except Exception as e:
        await message.answer(f"⚠️ Неизвестная ошибка: {str(e)}")
        print("Ошибка обработки WebApp данных:", e)
