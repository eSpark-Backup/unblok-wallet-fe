package com.unblok

data class TenorResponse(
        val results: List<GifResult>
)

data class GifResult(
        val media: List<Media>
)

data class Media(
        val gif: Gif
)

data class Gif(
        val url: String
)

