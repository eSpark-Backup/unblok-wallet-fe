package com.unblok.ApiService

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName



class GifResponse {
    @SerializedName("url")
    @Expose
    var url: String? = null

    @SerializedName("duration")
    @Expose
    var duration: Double? = null

    @SerializedName("preview")
    @Expose
    var preview: String? = null

    @SerializedName("dims")
    @Expose
    var dims: List<Int>? = null

    @SerializedName("size")
    @Expose
    var size: Int? = null
}
