
import cortex

cv = cortex.Volume('/home/user/Desktop/pycortex/filestore/db/S1/transforms/fullhead/reference.nii.gz','S1', 'fullhead' )

#cortex.webgl.make_static('TEST' , cv )

cortex.webshow(cv)

path1 = 'train_00001.nii.gz'
subject = 'PRJ1210_SUBJ003'
dv1 = cortex.Volume(path1, subject, 'fullhead')
cortex.webshow(dv1)
