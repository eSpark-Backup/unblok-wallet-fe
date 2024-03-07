package com.unblok

data class EmojiItem(
    val emoji: String,
    val description: String,
    val category: String,
    val aliases: List<String>,
    val tags: List<String>,
    val unicodeVersion: String,
    val iosVersion: String
)
