package com.example.nativelab

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.nativelab.activities.Add
import com.example.nativelab.activities.DetailActivity
import com.example.nativelab.adapter.AssignmentAdapter
import com.example.nativelab.model.Assignment
import com.example.nativelab.repository.Repository
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    companion object {
        const val INTENT_PARCELABLE = "OBJECT_INTENT"
    }

    private val ADD_ACTIVITY_REQUEST_CODE = 1

    private val repo = Repository()
    private var assignmentList: MutableList<Assignment> = mutableListOf<Assignment>()

    private lateinit var adapter: AssignmentAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val assignmentList = repo.getAssignmentList()

        // Create the recyclerView using the adapter and assignmentList from memory
        val recyclerView = findViewById<RecyclerView>(R.id._assignmentRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.setHasFixedSize(true)
        recyclerView.adapter = AssignmentAdapter(
            this,
            assignmentList
        ) {
            val intent = Intent(this, DetailActivity::class.java)
            intent.putExtra(INTENT_PARCELABLE, it)
            intent.putExtra("Repo", repo)
            startActivity(intent)
        }

        // Add button handler -> start another activity
        val addButton = findViewById<Button>(R.id.addButton)

        addButton.setOnClickListener{
            val intent = Intent(this, Add::class.java)
            intent.putExtra("Repo", repo)
            startActivityForResult(intent, ADD_ACTIVITY_REQUEST_CODE)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == ADD_ACTIVITY_REQUEST_CODE) {
            if (resultCode == RESULT_OK) {
                val assignment = data?.getParcelableExtra<Assignment>("NEW_ASSIGNMENT")

                if (assignment != null) {
                    addAssignmentAdapter(assignment)
                }

                super.onActivityResult(requestCode, resultCode, data)
            }
        }
    }

    private fun addAssignmentAdapter(assignment: Assignment) {
        // Add in memory
        repo.addAssignment(assignment)

        // Notify the adapter that the data has been changed
        assignmentList = repo.getAssignmentList()
        val recyclerView = findViewById<RecyclerView>(R.id._assignmentRecyclerView)
        recyclerView.adapter?.notifyItemInserted(0)
    }

}