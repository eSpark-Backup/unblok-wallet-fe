package com.simplemobiletools.keyboard.interfaces

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.simplemobiletools.keyboard.models.RecentClip


@Dao
interface RecentClipsDao {
    @Query("SELECT * FROM recent_clips ORDER BY id DESC LIMIT 7")
    fun getRecentClips(): List<RecentClip>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertOrUpdate(clip: RecentClip): Long

    @Query("DELETE FROM recent_clips WHERE id = :id")
    fun delete(id: Long)

    @Query("DELETE FROM recent_clips")
    fun deleteAll()
}
