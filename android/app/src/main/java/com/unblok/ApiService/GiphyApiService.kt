package com.unblok.ApiService

import com.unblok.StickerResponse
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Query

interface GiphyApiService {
    @GET("stickers/search")
    fun searchStickers(
        @Query("api_key") apiKey: String,
        @Query("q") query: String,
        @Query("limit") limit: Int,
        @Query("offset") offset: Int,
        @Query("rating") rating: String,
        @Query("lang") lang: String
    ): Call<StickerResponse>
}