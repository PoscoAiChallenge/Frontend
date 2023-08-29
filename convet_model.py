import tensorflowjs as tfjs
import tensorflow as tf
model = tf.keras.models.load_model("./best_model_site_all.h5")
tfjs.converters.save_keras_model(model, "./")