package com.unblok.adapters


import android.content.Context
import android.graphics.drawable.Drawable
import android.net.Uri
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.core.content.FileProvider
import androidx.core.net.toUri
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.request.target.CustomTarget
import com.bumptech.glide.request.transition.Transition
import com.unblock.R
import com.unblok.Datum
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URI
import java.net.URL


class GIFAdapter(
        private val context: Context,
        private var gifs: List<Datum>,
        private val itemClick: (gif: Uri) -> Unit
) :
        RecyclerView.Adapter<GIFAdapter.GIFViewHolder>() {
    private val layoutInflater = LayoutInflater.from(context)
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): GIFViewHolder {
        val layoutId = R.layout.item_gif
        val view = layoutInflater.inflate(layoutId, parent, false)
        return GIFViewHolder(view)
    }

    override fun onBindViewHolder(holder: GIFViewHolder, position: Int) {
        val gif = gifs[position]
        holder.bindView(gif) { itemView ->
            setupGIF(itemView, gif)
        }

    }


    override fun getItemCount(): Int {
        return gifs.size
    }

    private fun setupGIF(view: View, stickerUrl: Datum) {
        val stickerImageView: ImageView = view.findViewById(R.id.gif_value)

        Glide.with(view)
                .asGif()
                .load(stickerUrl.images.original.url)
                .into(stickerImageView)
    }

//    fun downloadPics(imageUrl: String): Uri? {
//        var imageUri: Uri? = null
//        try {
//            val url = URL(imageUrl)
//            val connection = url.openConnection() as HttpURLConnection
//            connection.doInput = true
//            connection.connect()
//
//            // Create a file to save the downloaded image
//            val file = File(context.cacheDir, "downloaded_image.jpg")
//            val outputStream = FileOutputStream(file)
//
//            // Read data from the connection input stream and write it to the file
//            val inputStream = connection.inputStream
//            val buffer = ByteArray(1024)
//            var bytesRead: Int
//            while (inputStream.read(buffer).also { bytesRead = it } != -1) {
//                outputStream.write(buffer, 0, bytesRead)
//            }
//
//            // Close streams
//            inputStream.close()
//            outputStream.close()
//
//            // Create a content URI for the saved image using FileProvider
//            imageUri = FileProvider.getUriForFile(
//                    context,
//                    "com.unblok.adapters.GIFAdapter",
//                    file
//            )
//        } catch (e: Exception) {
//            e.printStackTrace()
//        }
//
//        return imageUri
//    }
//
//
//    fun downloadImage(imageUrl: String): Uri {
//        // val imageUrl = "https://example.com/image.jpg" // Your image URL
//
//
//        try {
//            val url = URL(imageUrl)
//            val connection = url.openConnection() as HttpURLConnection
//            connection.connect()
//            if (connection.responseCode == HttpURLConnection.HTTP_OK) {
//                // Create an output stream to save the image
//                val imageFile = File(context.cacheDir, "image.jpg")
//                val outputStream: FileOutputStream = FileOutputStream(imageFile)
//
//                // Copy the image data from the connection input stream to the file output stream
//                val inputStream = connection.inputStream
//                val buffer = ByteArray(4096)
//                var bytesRead: Int
//                while (inputStream.read(buffer).also { bytesRead = it } != -1) {
//                    outputStream.write(buffer, 0, bytesRead)
//                }
//
//                // Close streams
//                inputStream.close()
//                outputStream.close()
//                val imageUri = FileProvider.getUriForFile(context, context.packageName + ".provider", imageFile)
//                return imageUri
//                // Now, you have downloaded and saved the image in the app's cache directory.
//                // You can use the imageFile to create a content URI or display the image.
//            } else {
//                // Handle the case where the download failed
//            }
//        } catch (e: IOException) {
//            e.printStackTrace()
//            // Handle exceptions
//        }
//        var uri = Uri.parse("")
//        return uri
//    }
fun String.toURI(): java.net.URI = java.net.URI.create(this)
    inner class GIFViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        fun bindView(sticker: Datum, callback: (itemView: View) -> Unit): View {
            Log.d("GIFFFFFFFFF", "" + sticker.images.original.url)
            var imageUrl = sticker.images.original.url;
            val uri = Uri.parse(imageUrl)

            // Use Uri.Builder to ensure content scheme
            val contentUri = Uri.Builder()
                    .scheme("content")
                    .authority(uri.authority)
                    .path(uri.path)
                    .query(uri.query)
                    .fragment(uri.fragment)
                    .build()
            println("Converted Content Uri: $contentUri")
//            var imageUri: Uri? = downloadImage(imageUrl);
            // Check if the image is already in the MediaStore
//            var uri = Uri.parse(sticker.images.original.url.toUri().toString())
//            Log.d("GIFFFFFFFFF URI ", "" + imageUri)
            return itemView.apply {
                callback(this)
                itemView.setOnClickListener {
 //                   if (imageUri != null) {
                        itemClick.invoke(contentUri)
  //                  }

                }
            }

        }
    }

    private fun handleStickerClick(sticker: Datum) {
        // Handle sticker click event here
        // You can add your own implementation
    }
}