from load import do as do_load
from transform import do as do_transform
from model import do as do_model

context = do_load(None)
context = do_transform(context)
context = do_model(context)