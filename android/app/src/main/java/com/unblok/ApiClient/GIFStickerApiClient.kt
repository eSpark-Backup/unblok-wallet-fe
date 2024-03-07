package com.unblok.ApiClient

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object GIFStickerApiClient {
    private const val BASE_URL = "https://api.giphy.com/v1/"

    val retrofit: Retrofit by lazy {
        Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
    }
}

