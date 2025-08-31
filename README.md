# To-Do List Web Application

## Project Description
This project is a simple yet powerful web-based To-Do List application designed to help users record, organize, and track their daily activities. It addresses the common problem of forgetting tasks by providing an intuitive interface for managing schedules. The application follows the CRUD (Create, Read, Update, Delete) pattern and stores data using the browser's localStorage. It features two main views: a Task List View (for categorizing tasks into Past, Today, Upcoming, and Completed) and a Calendar View (to see tasks distributed across dates).

## Technologies Used
- **HTML5**: Structure of the web pages
- **TailwindCSS**: Styling, modern and responsive design
- **JavaScript**: CRUD logic, event handling, and dynamic rendering
- **localStorage API**: Data persistence in the browser
- **IBM watsonx Granite-3.3-8B-Instruct**: AI support for code generation, refactoring, and documentation

These technologies were chosen for their simplicity, accessibility, and ability to run fully client-side without requiring a backend server.

## Features
1. **CRUD Operations**: Add, view, edit, and delete tasks.
2. **Persistent Data**: All tasks are saved in localStorage and persist across sessions.
3. **Multiple Views**: 
   - List View: Categorizes tasks into Past, Today, Upcoming, Completed.
   - Calendar View: Displays tasks in a monthly calendar layout.
4. **Dynamic UI Updates**: Task lists update in real-time without page reloads.
5. **Task Repeat Options**: Supports recurring tasks (daily, weekly, monthly, yearly).

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/fzhnd/capstone-project.git
   cd todo-list-app
   ```

2. Open the project:
   Simply open `index.html` in your web browser. No backend server is required.

3. Navigate the app:
   - Use `index.html` for managing tasks in the list view.
   - Use `list.html` for viewing tasks in the calendar view.

## AI Support Explanation
The development of this project was supported by **IBM watsonx Granite-3.3-8B-Instruct**, which played a key role in accelerating the process:

- **Code Generation**: Automatically generated HTML, CSS, and JavaScript code snippets from natural language prompts.
- **Refactoring**: Improved code structure and readability.
- **Feature Extension**: Assisted in quickly adding new features such as calendar integration and bulk delete options.

The use of AI significantly reduced development time, minimized errors, and ensured a cleaner, more maintainable codebase.
