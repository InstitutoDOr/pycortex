
import cortex
import cortex.dataset as dts


subject = 'PRJ1210_SUBJ003'
my_min = 0.15
my_max = 0.4
cm='afmhot_inksel'

ds = dts.Dataset()

dv1 = cortex.Volume('/home/brain/pycortex/IDOR/SUBJ003_train_corr.nii.gz', subject, 'fullhead', description='CORR',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(CORR=dv1)


feature_names = ['ZCR', 'CENTROID', 'BRIGHTNESS', 'SPREAD', 'ROLLOFF', 'ENTROPY', 'FLATNESS', 'ROUGHNESS', 'RMS', 'SUB_BAND_FLUX_01', 'SUB_BAND_FLUX_02', 'SUB_BAND_FLUX_03', 'SUB_BAND_FLUX_04', 'SUB_BAND_FLUX_05', 'SUB_BAND_FLUX_06', 'SUB_BAND_FLUX_07', 'SUB_BAND_FLUX_08', 'SUB_BAND_FLUX_09', 'SUB_BAND_FLUX_10', 'PULSE_CLARITY', 'KEY_CLARITY'];

for idx, fn in enumerate(feature_names):
    iidx = format(idx+1, '04d')
    dv01 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_'+iidx+'.nii.gz', subject, 'fullhead', description='FEATURE',  cmap='RdBu_r', vmin=-0.5, vmax=0.5)
    kwargs = {fn: dv01}

    ds.append(**kwargs)

'''
dv01 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0001.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR01=dv01)

dv02 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0002.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR02=dv02)

dv03 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0003.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR03=dv03)

dv04 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0004.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR04=dv04)

dv05 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0005.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR05=dv05)

dv06 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0006.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR06=dv06)

dv07 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0007.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR07=dv07)

dv08 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0008.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR08=dv08)

dv09 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0009.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR09=dv09)

dv10 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0010.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR10=dv10)

dv11 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0011.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR11=dv11)

dv12 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0012.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR12=dv12)

dv13 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0013.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR13=dv13)

dv14 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0014.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR14=dv14)

dv15 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0015.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR15=dv15)

dv16 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0016.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR16=dv16)

dv17 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0017.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR17=dv17)

dv18 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0018.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR18=dv18)

dv19 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0019.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR19=dv19)

dv19 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0019.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR19=dv19)

dv20 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0020.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR20=dv20)

dv21 = cortex.Volume('/home/brain/pycortex/IDOR/S3_W/W_mean_0021.nii.gz', subject, 'fullhead', description='FEATURES',  cvthr=0.1, cmap=cm, vmin=my_min, vmax=my_max, interp="trilinear", stim='/home/brain/pycortex/filestore/colormaps/autumn_blkmin_alpha_2D.png')
ds.append(MIR21=dv21)
'''

import cortex.webgl.view_adapted
cortex.webgl.view_adapted.show_adapted(ds)




