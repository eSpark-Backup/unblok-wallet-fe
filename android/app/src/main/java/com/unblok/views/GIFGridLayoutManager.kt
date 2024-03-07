package com.simplemobiletools.keyboard.views
import android.content.Context
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlin.math.max

class GIFGridLayoutManager(
    private var context: Context,
    private var itemWidth: Int
) : GridLayoutManager(context, 1) {

    override fun onLayoutChildren(recycler: RecyclerView.Recycler?, state: RecyclerView.State?) {
        val width = width
        val height = height
        if (width > 0 && height > 0) {
            val spanCount = calculateSpanCount(width, height)
            setSpanCount(spanCount)
        }
        super.onLayoutChildren(recycler, state)
    }
    private fun calculateSpanCount(width: Int, height: Int): Int {
        val minItemWidth = context.resources.getDimensionPixelSize(itemWidth)
        val maxSpanCount = width / minItemWidth
        return max(1, maxSpanCount)
    }
}