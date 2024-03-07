package org.dslul.openboard.inputmethod.latin.utils;


import  java.util.concurrent.TimeUnit;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class APiClient {
    private static APiClient instance;
    private RetrofitAPI apiInterface;

    String BaseUrl = "http://192.53.121.26:8096/v1/keyboard/";
    public static APiClient getInstance() {
        if (instance == null) {
            instance = new APiClient();
        }
        return instance;
    }

    public APiClient() {
        HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
        interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);
        OkHttpClient client = new OkHttpClient.Builder().addInterceptor(interceptor)
                .connectTimeout(300, TimeUnit.SECONDS)
                .readTimeout(300, TimeUnit.SECONDS)
                .writeTimeout(300, TimeUnit.SECONDS).build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BaseUrl)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiInterface = retrofit.create(RetrofitAPI.class);
    }

    public RetrofitAPI getApiInterface() {
        return apiInterface;
    }
}
