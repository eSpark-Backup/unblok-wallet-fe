package com.unblok.interfaces

import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Query

interface TenorService {
    @GET("search")
    fun getSearchResults(
            @Query("q") searchTerm: String,
            @Query("key") apiKey: String,
            @Query("limit") limit: Int
    ): Call<ResponseBody>
}