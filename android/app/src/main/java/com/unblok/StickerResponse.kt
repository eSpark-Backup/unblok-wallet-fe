package com.unblok



import com.beust.klaxon.*

private fun <T> Klaxon.convert(k: kotlin.reflect.KClass<*>, fromJson: (JsonValue) -> T, toJson: (T) -> String, isUnion: Boolean = false) =
    this.converter(object: Converter {
        @Suppress("UNCHECKED_CAST")
        override fun toJson(value: Any)        = toJson(value as T)
        override fun fromJson(jv: JsonValue)   = fromJson(jv) as Any
        override fun canConvert(cls: Class<*>) = cls == k.java || (isUnion && cls.superclass == k.java)
    })

private val klaxon = Klaxon()
    .convert(Rating::class, { Rating.fromValue(it.string!!) }, { "\"${it.value}\"" })
    .convert(Type::class,   { Type.fromValue(it.string!!) },   { "\"${it.value}\"" })

data class StickerResponse (
    val data: List<Datum>,
    val pagination: Pagination,
    val meta: Meta
) {
    public fun toJson() = klaxon.toJsonString(this)

    companion object {
        public fun fromJson(json: String) = klaxon.parse<StickerResponse>(json)
    }
}

data class Datum (
    val type: Type,
    val id: String,
    val url: String,
    val slug: String,

    @Json(name = "bitly_gif_url")
    val bitlyGIFURL: String,

    @Json(name = "bitly_url")
    val bitlyURL: String,

    @Json(name = "embed_url")
    val embedURL: String,

    val username: String,
    val source: String,
    val title: String,
    val rating: Rating,

    @Json(name = "content_url")
    val contentURL: String,

    @Json(name = "source_tld")
    val sourceTLD: String,

    @Json(name = "source_post_url")
    val sourcePostURL: String,

    @Json(name = "is_sticker")
    val isSticker: Long,

    @Json(name = "import_datetime")
    val importDatetime: String,

    @Json(name = "trending_datetime")
    val trendingDatetime: String,

    val images: Images,

    @Json(name = "analytics_response_payload")
    val analyticsResponsePayload: String,

    val analytics: Analytics,
    val user: User? = null
)

data class Analytics (
    val onload: Onclick,
    val onclick: Onclick,
    val onsent: Onclick
)

data class Onclick (
    val url: String
)

data class Images (
    val original: FixedHeight,
    val downsized: The480_WStill,

    @Json(name = "downsized_large")
    val downsizedLarge: The480_WStill,

    @Json(name = "downsized_medium")
    val downsizedMedium: The480_WStill,

    @Json(name = "downsized_small")
    val downsizedSmall: DownsizedSmall,

    @Json(name = "downsized_still")
    val downsizedStill: The480_WStill,

    @Json(name = "fixed_height")
    val fixedHeight: FixedHeight,

    @Json(name = "fixed_height_downsampled")
    val fixedHeightDownsampled: FixedHeight,

    @Json(name = "fixed_height_small")
    val fixedHeightSmall: FixedHeight,

    @Json(name = "fixed_height_small_still")
    val fixedHeightSmallStill: The480_WStill,

    @Json(name = "fixed_height_still")
    val fixedHeightStill: The480_WStill,

    @Json(name = "fixed_width")
    val fixedWidth: FixedHeight,

    @Json(name = "fixed_width_downsampled")
    val fixedWidthDownsampled: FixedHeight,

    @Json(name = "fixed_width_small")
    val fixedWidthSmall: FixedHeight,

    @Json(name = "fixed_width_small_still")
    val fixedWidthSmallStill: The480_WStill,

    @Json(name = "fixed_width_still")
    val fixedWidthStill: The480_WStill,

    val looping: Looping,

    @Json(name = "original_still")
    val originalStill: The480_WStill,

    @Json(name = "original_mp4")
    val originalMp4: DownsizedSmall,

    val preview: DownsizedSmall,

    @Json(name = "preview_gif")
    val previewGIF: The480_WStill,

    @Json(name = "preview_webp")
    val previewWebp: The480_WStill,

    @Json(name = "480w_still")
    val the480WStill: The480_WStill,

    val hd: DownsizedSmall? = null
)

data class The480_WStill (
    val height: String,
    val width: String,
    val size: String,
    val url: String
)

data class DownsizedSmall (
    val height: String,
    val width: String,

    @Json(name = "mp4_size")
    val mp4Size: String,

    val mp4: String
)

data class FixedHeight (
    val height: String,
    val width: String,
    val size: String,
    val url: String,

    @Json(name = "mp4_size")
    val mp4Size: String? = null,

    val mp4: String? = null,

    @Json(name = "webp_size")
    val webpSize: String,

    val webp: String,
    val frames: String? = null,
    val hash: String? = null
)

data class Looping (
    @Json(name = "mp4_size")
    val mp4Size: String,

    val mp4: String
)

enum class Rating(val value: String) {
    G("g");

    companion object {
        public fun fromValue(value: String): Rating = when (value) {
            "g"  -> G
            else -> throw IllegalArgumentException()
        }
    }
}

enum class Type(val value: String) {
    Sticker("sticker");

    companion object {
        public fun fromValue(value: String): Type = when (value) {
            "sticker" -> Sticker
            else      -> throw IllegalArgumentException()
        }
    }
}

data class User (
    @Json(name = "avatar_url")
    val avatarURL: String,

    @Json(name = "banner_image")
    val bannerImage: String,

    @Json(name = "banner_url")
    val bannerURL: String,

    @Json(name = "profile_url")
    val profileURL: String,

    val username: String,

    @Json(name = "display_name")
    val displayName: String,

    val description: String,

    @Json(name = "instagram_url")
    val instagramURL: String,

    @Json(name = "website_url")
    val websiteURL: String,

    @Json(name = "is_verified")
    val isVerified: Boolean
)

data class Meta (
    val status: Long,
    val msg: String,

    @Json(name = "response_id")
    val responseID: String
)

data class Pagination (
    @Json(name = "total_count")
    val totalCount: Long,

    val count: Long,
    val offset: Long
)
