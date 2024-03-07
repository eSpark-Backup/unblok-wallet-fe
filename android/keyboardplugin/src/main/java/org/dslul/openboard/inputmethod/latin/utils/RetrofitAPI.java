package org.dslul.openboard.inputmethod.latin.utils;


import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface RetrofitAPI {
    @POST("keyboardrecord")
    Call<DataModal> sendKeyboardRecord(@Body RequestModal request);
}

