import cortex
import numpy as np
import tempfile


tf = tempfile.NamedTemporaryFile(suffix=".png")
view = cortex.Volume.random("S1", "fullhead", cmap="hot")
cortex.quickflat.make_png(tf.name, view)

cortex.webshow(view)
    