mod db;
use db::{init_db, DbState};
use rusqlite::params;
use std::sync::Mutex;
use serde::{Serialize, Deserialize};
use tauri::Manager;

#[derive(Serialize, Deserialize)]
struct Message {
    user: String,
    text: String,
    time: String,
}

#[tauri::command]
fn get_messages(state: tauri::State<DbState>) -> Result<Vec<Message>, String> {
    let conn = state.0.lock().unwrap();
    let mut stmt = conn.prepare("SELECT user, text, time FROM messages").map_err(|e| e.to_string())?;
    let msg_iter = stmt.query_map([], |row| {
        Ok(Message {
            user: row.get(0)?,
            text: row.get(1)?,
            time: row.get(2)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut messages = Vec::new();
    for msg in msg_iter {
        messages.push(msg.map_err(|e| e.to_string())?);
    }
    Ok(messages)
}

#[tauri::command]
fn save_message(user: String, text: String, time: String, state: tauri::State<DbState>) -> Result<(), String> {
    let conn = state.0.lock().unwrap();
    conn.execute(
        "INSERT INTO messages (user, text, time) VALUES (?1, ?2, ?3)",
        params![user, text, time],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let conn = init_db(app.handle()).expect("failed to init db");
            app.manage(DbState(Mutex::new(conn)));
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_messages, save_message])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
