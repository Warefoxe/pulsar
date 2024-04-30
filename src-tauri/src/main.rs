// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod nebula;
mod upload;

use log::info;
use tauri_plugin_log::LogTarget;

fn setup<R>(app: &mut tauri::App<R>) -> Result<(), Box<dyn std::error::Error>>
where
    R: tauri::Runtime,
{
    let app_data_dir = app.handle().path_resolver().app_data_dir();
    info!(
        "App data dir: \x1b[34m{}\x1b[0m",
        app_data_dir.unwrap().to_str().unwrap()
    );
    Ok(())
}

fn main() {
    use log::LevelFilter;
    use tauri_plugin_log::fern::colors::ColoredLevelConfig;

    tauri::Builder::default()
        .setup(setup)
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::Stdout])
                .with_colors(ColoredLevelConfig::default())
                .level(LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(nebula::nebula::init())
        .plugin(upload::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        assert_eq!("Johnny", "Hello, Johnny! You've been greeted from Rust!");
    }
}
