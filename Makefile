ZANIMO = zanimo.js
ZANIMOMIN = zanimo.min.js
BUILDDIR = build

FILES = src/Zanimo.js\
		src/Zanimo.async.js

all: cat
	@@java -jar bin/compiler.jar --js ${BUILDDIR}/${ZANIMO} --js_output_file ${BUILDDIR}/${ZANIMOMIN}

cat:
	@@cat ${FILES} > ${BUILDDIR}/${ZANIMO};

clean:
	@@rm ${BUILDDIR}/${ZANIMO} ${BUILDDIR}/${ZANIMOMIN}
