package com.simplemobiletools.keyboard.databases

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.simplemobiletools.keyboard.interfaces.RecentClipsDao
import com.simplemobiletools.keyboard.models.RecentClip

@Database(entities = [RecentClip::class], version = 2)
abstract class RecentClipsDatabase : RoomDatabase() {

    abstract fun RecentClipsDao(): RecentClipsDao

    companion object {
        private var db: RecentClipsDatabase? = null

        fun getInstance(context: Context): RecentClipsDatabase {
            if (db == null) {
                synchronized(RecentClipsDatabase::class) {
                    if (db == null) {
                        db = Room.databaseBuilder(
                            context.applicationContext,
                            RecentClipsDatabase::class.java,
                            "recentclips.db"
                        )
                            .fallbackToDestructiveMigration()
                            .build()
                        db!!.openHelper.setWriteAheadLoggingEnabled(true)
                    }
                }
            }
            return db!!
        }

        fun destroyInstance() {
            db = null
        }
    }
}
