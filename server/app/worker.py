from celery import Celery

app = Celery('worker', broker='redis://localhost')

#TODO: add task to process images
# @app.task
