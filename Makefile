ZANIMO = zanimo
BUILDDIR = build
VERSION = `cat VERSION`
FILES = src/Zanimo.js

all: cat
	@@java -jar bin/compiler.jar --js ${BUILDDIR}/${ZANIMO}-${VERSION}.js --js_output_file ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js

cat:
	@@cat ${FILES} > ${BUILDDIR}/${ZANIMO}-${VERSION}.js;

clean:
	@@rm ${BUILDDIR}/${ZANIMO}-${VERSION}.js ${BUILDDIR}/${ZANIMO}-${VERSION}.min.js
