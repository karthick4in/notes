import threading
import mysql.connector
from mysql.connector import Error

def sleep_query(thread_id, seconds):
    try:
        connection = mysql.connector.connect(
            host='your_mysql_host',
            database='your_database',
            user='your_username',
            password='your_password'
        )

        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute(f"SELECT SLEEP({seconds})")
            result = cursor.fetchone()
            print(f"Thread {thread_id} executed sleep query for {seconds} seconds")
    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Number of threads
num_threads = 5

# List to hold thread objects
threads = []

# Create and start threads
for i in range(num_threads):
    thread = threading.Thread(target=sleep_query, args=(i + 1, 3))
    threads.append(thread)
    thread.start()

# Wait for all threads to finish
for thread in threads:
    thread.join()

print("All threads have finished.")
