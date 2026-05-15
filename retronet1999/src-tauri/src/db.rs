use rusqlite::{params, Connection, Result};
use std::sync::Mutex;
use tauri::AppHandle;
use tauri::Manager;

pub struct DbState(pub Mutex<Connection>);

pub fn init_db(app: &AppHandle) -> Result<Connection> {
    let app_dir = app.path().app_data_dir().expect("failed to get app data dir");
    std::fs::create_dir_all(&app_dir).expect("failed to create app data dir");
    let db_path = app_dir.join("retro.db");
    let conn = Connection::open(db_path)?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY,
            user TEXT NOT NULL,
            text TEXT NOT NULL,
            time TEXT NOT NULL
        )",
        [],
    )?;

    Ok(conn)
}
