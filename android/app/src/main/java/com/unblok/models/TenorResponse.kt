package com.unblok.models

data class TenorResponse(
        val results: List<TenorGif>,
        // Add other properties if needed
)

data class TenorGif(
        val media: List<TenorMedia>,
        // Add other properties if needed
)

data class TenorMedia(
        val gif: TenorGifDetails,
        // Add other properties if needed
)

data class TenorGifDetails(
        val url: String
        // Add other properties if needed
)
