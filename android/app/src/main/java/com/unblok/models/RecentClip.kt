package com.simplemobiletools.keyboard.models

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "recent_clips")
data class RecentClip(
    @PrimaryKey(autoGenerate = true) var id: Long?,
    @ColumnInfo(name = "value") var value: String
):ListItem()
