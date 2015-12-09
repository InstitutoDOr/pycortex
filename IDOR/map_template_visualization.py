
import cortex
import cortex.dataset as dts

subject = 'template_colin'
# color map limits
my_min = 3
my_max = 5
cm='afmhot_inksel'

dv1 = cortex.Volume('map1.nii.gz', subject, 'fullhead', description='Description1',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max)
dv2 = cortex.Volume('map2.nii.gz', subject, 'fullhead', description='Description2',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max)
dv3 = cortex.Volume('map3.nii.gz', subject, 'fullhead', description='Description3',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max)

ds = dts.Dataset()
ds.append(TrainCorr1=dv1)
ds.append(TrainCorr2=dv2)
ds.append(TrainCorr3=dv3)

cortex.webshow(ds)





