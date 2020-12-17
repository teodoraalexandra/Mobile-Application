package com.example.nativelab.repository
import com.example.nativelab.model.Assignment

import android.os.Parcelable
import kotlinx.android.parcel.Parcelize

@Parcelize
class Repository () : Parcelable {
    companion object {
        val assignmentList: MutableList<Assignment> = mutableListOf();
    }

    init {
        if (assignmentList.size == 0) {
            assignmentList.add(Assignment(1, "Project idea", "MA", 1, true, 1, "09-11-2020"))
            assignmentList.add(Assignment(2, "Encoder", "AVDP", 1, true, 1, "06-11-2020"))
            assignmentList.add(Assignment(3, "Futures", "PDP", 4, true, 2, "11-11-2020"))
            assignmentList.add(Assignment(4, "Load balancer", "CAA", 2, false, 3, "05-11-2020"))
            assignmentList.add(Assignment(5, "Native Lab", "MA", 2, true, 1, "09-11-2020"))
            assignmentList.add(Assignment(6, "Decoder", "AVDP", 2, false, 3, "20-11-2020"))
            assignmentList.add(Assignment(7, "Matrix multiplication", "PDP", 2, true, 5, "10-11-2020"))
            assignmentList.add(Assignment(8, "Server integration", "MA", 5, true, 1, "01-01-2021"))
        }
    }

    fun getAssignmentList() : MutableList<Assignment> {
        return assignmentList
    }

    fun addAssignment(assignment: Assignment) {
        assignmentList.add(0, assignment)
    }

    fun updateAssignment(newId: Int, newAssignment: Assignment) {
        for(oldAssignment in assignmentList){
            if(oldAssignment.id == newId){
                oldAssignment.title = newAssignment.title
                oldAssignment.course = newAssignment.course
                oldAssignment.number = newAssignment.number
                oldAssignment.mandatory = newAssignment.mandatory
                oldAssignment.problem = newAssignment.problem
                oldAssignment.date = newAssignment.date
            }
        }
    }

    fun deleteAssignment(assignment: Assignment) {
        assignmentList.remove(assignment)
    }

    fun getNextId(): Int {
        val maxAssignment = assignmentList.maxBy { assignment -> assignment.id  }
        if (maxAssignment != null) {
            return maxAssignment.id + 1
        }
        return -1
    }
}