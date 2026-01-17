# Quick Testing Guide - Real Data Integration

## ✅ Migration Complete!

All dummy data has been removed. EduCollab now fetches **real data from MongoDB**.

---

## 🚀 How to Test

### **1. Start Backend Server**

```bash
cd server
node server.js
```

Expected output:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

### **2. Start Frontend**

In a new terminal:
```bash
npm start
```

React app will open at `http://localhost:3000`

---

## 🧪 Testing Checklist

### **✅ Authentication**

1. **Sign Up:**
   - Go to `/register`
   - Create a new account
   - Should create user in MongoDB automatically
   - Should redirect to dashboard

2. **Login:**
   - Use existing credentials
   - Should fetch user profile from MongoDB
   - Token sent with every API request

---

### **✅ Dashboard Page**

**What to Test:**

1. **Stats Cards:**
   - "Joined Groups" - shows real count from MongoDB
   - "Pending Tasks" - calculated from actual tasks
   - "Study Hours" - placeholder (0 for now)

2. **My Study Groups Section:**
   - If you have groups → shows up to 4 groups
   - If no groups → shows "No study groups yet" message
   - Each group shows:
     - Real name from database
     - Subject
     - Member count
     - Last updated date

3. **Today's Tasks:**
   - Shows tasks with due date = today
   - Click checkbox to toggle completion
   - Status updates in database
   - Task gets strikethrough when completed
   - If no tasks today → "No tasks due today"

4. **Upcoming Deadlines:**
   - Shows next 3 upcoming tasks
   - Sorted by due date
   - Displays task title, subject, and formatted date
   - If empty → "No upcoming deadlines"

**Expected Behavior:**
- Page shows loading spinner initially
- Data appears after ~1-2 seconds
- Empty states display when no data exists

---

### **✅ My Study Groups Page**

**What to Test:**

1. **View Groups:**
   - All your groups load from MongoDB
   - Each card shows:
     - Group name
     - Subject badge
     - Description
     - Member count
     - Last activity date
     - "Private" badge if not public

2. **Stats Bar:**
   - Total Groups - correct count
   - Public Groups - counts only public groups
   - Total Members - sum of all member arrays

3. **Create New Group:**
   - Click "Create New Group"
   - Fill form:
     - Name: "Test Study Group"
     - Subject: "Testing"
     - Description: "This is a test"
     - Public/Private toggle
   - Click "Create Group"
   - New group appears at top
   - Group saved in MongoDB
   - Stats update automatically

**Expected Behavior:**
- Loading spinner initially
- Groups load from database
- New group persists after page refresh
- Empty state if no groups

---

### **✅ Tasks & Planner Page**

**What to Test:**

1. **View Tasks:**
   - All tasks load from MongoDB
   - Tasks sorted into 3 categories:
     - **Today** - due today, not completed
     - **Upcoming** - future tasks, not completed
     - **Completed** - all completed tasks

2. **Stats Bar:**
   - Total Tasks - all tasks count
   - Pending - not completed count
   - Completed - completed count
   - High Priority - high priority pending count

3. **Priority Filter:**
   - Click "All Tasks" → shows everything
   - Click "High Priority" → shows only high priority
   - Click "Medium Priority" → shows only medium
   - Click "Low Priority" → shows only low

4. **Toggle Task Completion:**
   - Click circle checkbox on any task
   - Task moves between sections
   - Completion persists to MongoDB
   - Stats update immediately

5. **Add New Task:**
   - Click "Add Task"
   - Fill form:
     - Title: "Test Task"
     - Description: "Testing real data"
     - Subject: "General"
     - Due Date: Tomorrow's date
     - Due Time: 10:00 AM
     - Priority: High
   - Click "Add Task"
   - Task appears in "Upcoming" section
   - Task saved in MongoDB

**Expected Behavior:**
- Tasks load with spinner
- Completion toggle updates database
- New task persists after refresh
- Empty states show when no tasks in category

---

### **✅ Notes & Resources Page**

**What to Test:**

1. **View Resources:**
   - All resources load from MongoDB
   - Each card shows:
     - File type icon (PDF/PPT/DOC)
     - File title
     - Subject badge
     - Description
     - Uploader name
     - Upload date
     - File size

2. **Stats Bar:**
   - Total Resources - all count
   - PDF Files - count of PDFs
   - Total Size - calculated size
   - Your Uploads - resources you uploaded

3. **Search:**
   - Type in search box
   - Filters resources by title/description
   - Updates in real-time

4. **Subject Filter:**
   - Dropdown shows all unique subjects
   - Select subject → filters resources
   - "All Subjects" shows everything

5. **Upload Resource:**
   - Click "Upload Resource"
   - Fill form:
     - File Name: "Test Document.pdf"
     - File Type: PDF
     - Subject: "Testing"
     - Description: "Test resource"
   - Click "Upload"
   - Resource appears at top
   - Resource saved in MongoDB

**Expected Behavior:**
- Resources load with spinner
- Search/filter work on real data
- Upload persists after refresh
- Empty state if no resources

---

### **✅ Progress Page**

**What to Test:**

1. **Summary Stats:**
   - Study Hours - 0 (not yet implemented)
   - Tasks Completed - real count from MongoDB
   - Active Groups - real groups count
   - Current Streak - 0 (not yet implemented)

2. **Subject Progress:**
   - Shows progress for each subject
   - Calculated from task completion
   - Progress bars based on completed/total tasks
   - If no tasks → no progress shown

3. **Task Completion Rate:**
   - Circular progress indicator
   - Shows X completed out of Y total
   - Percentage calculated from real data

**Expected Behavior:**
- Loads with spinner
- Stats calculated from MongoDB data
- Updates when you complete tasks

---

## 🔍 How to Verify Data is Real

### **Method 1: Check MongoDB**

1. Open MongoDB Compass or Atlas
2. Connect to your database
3. Check collections:
   - `users` - your user profile
   - `groups` - created groups
   - `tasks` - your tasks
   - `resources` - uploaded resources

### **Method 2: Check Browser DevTools**

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Look for API calls:
   - `GET /api/groups/user/{firebaseUid}`
   - `GET /api/tasks/user/{firebaseUid}`
   - `POST /api/tasks` (when creating)
   - etc.
5. Click on API call
6. View **Response** tab → see real data

### **Method 3: Test Persistence**

1. Create a task
2. Close browser completely
3. Reopen browser
4. Login again
5. Task should still be there ✅

---

## 🐛 Troubleshooting

### **Issue: No data showing**

**Check:**
1. Is backend running? (`node server.js`)
2. Is MongoDB connected? (check terminal logs)
3. Are you logged in?
4. Check browser console for errors

**Fix:**
- Restart backend server
- Check `.env` files
- Verify MongoDB connection string

---

### **Issue: "Failed to load data" error**

**Possible causes:**
1. Backend not running
2. MongoDB connection failed
3. Firebase token expired
4. CORS issue

**Fix:**
- Check backend terminal for errors
- Verify Firebase credentials in `server/.env`
- Clear browser cache and login again

---

### **Issue: Data not persisting**

**Check:**
1. API calls succeeding? (Network tab)
2. MongoDB write errors? (backend logs)
3. Authentication token valid?

**Fix:**
- Check backend console for error messages
- Verify MongoDB user has write permissions

---

## 📊 Expected API Flow

### **When Dashboard Loads:**

1. **Frontend:**
   ```
   useEffect → fetchDashboardData()
   → groupAPI.getUserGroups(firebaseUid)
   → taskAPI.getUserTasks(firebaseUid)
   ```

2. **Backend receives:**
   ```
   GET /api/groups/user/{firebaseUid}
   Authorization: Bearer {firebase_token}
   ```

3. **Backend processes:**
   ```
   authMiddleware verifies token
   → extracts firebaseUid
   → queries MongoDB: Group.find({ members: firebaseUid })
   → returns array of groups
   ```

4. **Frontend updates:**
   ```
   setGroups(groupsData)
   setTasks(tasksData)
   setLoading(false)
   ```

---

## ✅ Success Indicators

**You know it's working when:**

1. ✅ Loading spinners appear briefly
2. ✅ Real data displays (not hardcoded text)
3. ✅ Actions persist after page refresh
4. ✅ Stats change when you create/delete items
5. ✅ Empty states show when no data
6. ✅ Error messages appear if API fails
7. ✅ MongoDB collections grow when you create data

---

## 🎉 What's Different from Before?

| Before | After |
|--------|-------|
| Hardcoded arrays | MongoDB queries |
| Fake IDs (1, 2, 3) | MongoDB ObjectIds (_id) |
| No persistence | Data saved to database |
| No loading states | Spinners during fetch |
| No error handling | Error messages displayed |
| Mock user names | Real Firebase user data |
| Static stats | Dynamically calculated |

---

## 📝 Test Scenarios

### **Scenario 1: New User**
1. Sign up
2. Dashboard shows empty states
3. Create first group
4. Create first task
5. View progress (should show new data)

### **Scenario 2: Existing User**
1. Login
2. See all existing groups/tasks
3. Add new task
4. Toggle task completion
5. Check progress updates

### **Scenario 3: Multiple Devices**
1. Login on Device A
2. Create task
3. Login on Device B
4. Task should appear (same MongoDB data)

---

## 🎓 Need Help?

Check these files:
- **Migration Guide:** `REAL_DATA_MIGRATION_COMPLETE.md`
- **Original Setup:** `MONGODB_MIGRATION_COMPLETE.md`
- **Architecture:** `.github/copilot-instructions.md`

**Common Questions:**

**Q: Where is the data stored?**  
A: MongoDB Atlas cloud database

**Q: How does authentication work?**  
A: Firebase Auth → Token → Backend verifies → MongoDB query

**Q: Can I see the API calls?**  
A: Yes! Open DevTools → Network tab

**Q: Data not updating?**  
A: Check backend logs for errors

---

## 🚀 Ready to Deploy?

Once testing is complete:

1. ✅ All components load data from MongoDB
2. ✅ CRUD operations work
3. ✅ Error handling in place
4. ✅ Loading states implemented
5. ✅ Empty states display correctly

**Next steps:**
- Add file storage for resources (AWS S3)
- Implement real-time updates (Socket.io)
- Add time tracking for study hours
- Build group chat feature

---

**Happy Testing! 🎉**
