package com.unblok

import com.google.gson.annotations.SerializedName

data class WordSuggestion(
    @SerializedName("word")
    var word: String
)
