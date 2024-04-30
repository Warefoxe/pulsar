// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod nebula;
mod sqlite;
mod upload;

use tauri_plugin_log::LogTarget;

fn main() {
    use log::LevelFilter;
    use tauri_plugin_log::fern::colors::ColoredLevelConfig;

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::Stdout])
                .with_colors(ColoredLevelConfig::default())
                .level(LevelFilter::Info)
                .build(),
        )
        .plugin(sqlite::Builder::default().build())
        .plugin(nebula::init_plugin())
        .plugin(upload::init_plugin())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
