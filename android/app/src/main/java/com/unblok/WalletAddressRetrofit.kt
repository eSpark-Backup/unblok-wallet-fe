package com.unblok;

import com.unblok.DataModal.WalletDataModal;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

interface WalletAddressRetrofit {
    @GET("/v1/user/getUserBymail")
    fun getUserByMail(@Query("mailAddress") mailAddress: String): Call<WalletDataModal>
}


