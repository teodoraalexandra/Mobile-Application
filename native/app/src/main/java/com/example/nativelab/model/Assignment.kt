package com.example.nativelab.model

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize

@Parcelize
data class Assignment(
    val id: Int,
    var title: String,
    var course: String,
    var number: Int,
    var mandatory: Boolean,
    var problem: Int,
    var date: String
) : Parcelable